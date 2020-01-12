package com.alves.ramon.SpringAjax.web.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alves.ramon.SpringAjax.domain.Categoria;
import com.alves.ramon.SpringAjax.domain.Promocao;
import com.alves.ramon.SpringAjax.repository.CategoriaRepository;
import com.alves.ramon.SpringAjax.repository.PromocaoRepository;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {
	
	private static Logger log = LoggerFactory.getLogger(PromocaoController.class);
	
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@Autowired
	private PromocaoRepository promocaoRepository;
	
	@PostMapping("/save")
	public ResponseEntity<?> salvarPromocao (@Valid Promocao promocao, BindingResult result) {
		
		//Varre todos os atributos do Objeto e valida com base nas Tags que foram colocadas 
		//na classe modelo.
		if(result.hasErrors()) {
			Map<String, String> erros = new HashMap<>();
			for (FieldError error : result.getFieldErrors()) {
				erros.put(error.getField(), error.getDefaultMessage());
			}
			return ResponseEntity.unprocessableEntity().body(erros);
		}
		
		
		promocao.setDtCadastro(LocalDateTime.now());
		log.info("Promocao: {}", promocao.toString());
		promocaoRepository.save(promocao);
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/list")
	public String listarPromocoes(ModelMap model) {
		Sort sort = Sort.by(Sort.Direction.DESC, "dtCadastro");
		PageRequest pageRequest = PageRequest.of(0, 8, sort);
		model.addAttribute("promocoes", promocaoRepository.findAll(pageRequest));
		return "promo-list";
	}
	
	@GetMapping("/list/loadmore")
	public String listarMaisPromocoes(@RequestParam(name = "page", defaultValue = "1") int page, ModelMap model) {
		Sort sort = Sort.by(Sort.Direction.DESC, "dtCadastro");
		PageRequest pageRequest = PageRequest.of(page, 8, sort);
		model.addAttribute("promocoes", promocaoRepository.findAll(pageRequest));
		return "promo-card";
	}
	
	@PostMapping("/like/{id}")
	public ResponseEntity<?> actionLike(@PathVariable("id") long id) {
		promocaoRepository.updateSomarLikes(id);
		int likes = promocaoRepository.findLikeById(id);
		return ResponseEntity.ok(likes);
	}
	
	@GetMapping("/site")
	public ResponseEntity<?> autoCompleteByName(@RequestParam("termo") String site){
		List<String> sites = promocaoRepository.findSitesByName(site);
		return ResponseEntity.ok(sites);
	}
	
	@ModelAttribute("categorias")
	private List<Categoria> getCategorias(){
		return categoriaRepository.findAll();
	}
	
	@GetMapping("/add")
	public String abrirCadastro() {
		return "promo-add";
	}
	
	

}
