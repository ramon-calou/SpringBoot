package com.alves.ramon.SpringAjax;

import org.directwebremoting.spring.DwrSpringServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;
@ImportResource(locations = "classpath: dwr-spring.xml")
@SpringBootApplication
public class SpringAjaxApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringAjaxApplication.class, args);
	}
	
	@Bean
	public ServletRegistrationBean<DwrSpringServlet> dwrSpringServlet(){
		DwrSpringServlet dwrSpringServlet = new DwrSpringServlet();
		
		ServletRegistrationBean<DwrSpringServlet> registrationBean = new ServletRegistrationBean<>(dwrSpringServlet, "/dwr/*");
		
		registrationBean.addInitParameter("debug", "true");
		registrationBean.addInitParameter("activeReverAjaxEnabled", "true");
		return registrationBean;
	}

}
