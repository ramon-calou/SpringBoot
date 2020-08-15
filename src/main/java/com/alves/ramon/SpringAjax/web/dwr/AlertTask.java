package com.alves.ramon.SpringAjax.web.dwr;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.TimerTask;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.WebContext;

import com.alves.ramon.SpringAjax.repository.PromocaoRepository;

public class AlertTask extends TimerTask {

	private PromocaoRepository repository;
	
	private LocalDateTime lastDate;
	private WebContext context;
	private long count;
	
	public AlertTask(LocalDateTime lastDate, WebContext context, PromocaoRepository repository) {
		super();
		this.lastDate = lastDate;
		this.context = context;
		this.repository = repository;
	}

	@Override
	public void run() {
		String sessionID = context.getScriptSession().getId();

		Browser.withSession(context, sessionID, new Runnable() {

			@Override
			public void run() {
				Map<String, Object> map = repository.totalAndLastPromoByDate(lastDate);

				count = (long) map.get("count");
				lastDate = map.get("lastDate") == null ? lastDate : (LocalDateTime) map.get("lastDate");

				if (count > 0) {
					ScriptSessions.addFunctionCall("showButton", count);
				}

			}
		});

	}

}
