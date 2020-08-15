package com.alves.ramon.SpringAjax.web.dwr;

import java.time.LocalDateTime;
import java.util.Timer;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Component;

import com.alves.ramon.SpringAjax.repository.PromocaoRepository;

@Component
@RemoteProxy
public class DWRAlertaPromocoes {

	@Autowired
	private PromocaoRepository repository;
	
	private Timer timer;
	
	@RemoteMethod
	public synchronized void initDWR() {
		LocalDateTime lastDate = getDateByLastPromo();
		
		WebContext context = WebContextFactory.get();
		
		timer = new Timer();
		
		timer.schedule(new AlertTask(lastDate, context, repository), 10000, 60000);
		
	}
	
	private LocalDateTime getDateByLastPromo() {
		PageRequest pageRequest = PageRequest.of(0, 1, Direction.DESC, "dtCadastro");
		return repository.findLastDatePromocao(pageRequest).getContent().get(0);
	}
	
	
	
}