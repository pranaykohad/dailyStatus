package com.statushub.mail;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.statushub.entity.User;
import com.statushub.service.UserService;

@Service
public class MailServiceImpl {

	private static final Logger LOG = LoggerFactory.getLogger("MailServiceImpl.class");

	@Autowired
	private UserService userService;

	private MailConfig mailConfig;

	private Properties properties; 

	MailServiceImpl(final MailConfig mailConfig) {
		this.mailConfig = mailConfig;
		this.properties = setMailProperties();
	}
	
	@Scheduled(cron = "${mail.shedule}")  
	public void cronJobSch() {
		LOG.debug("Cron job started: >>>>>>>>>>>{}", LocalDate.now());
		final LocalDate dateObj = LocalDate.now();
		final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/YYYY");
		@SuppressWarnings("unchecked")
		final List<User> userList = (List<User>) userService.getDefaultersList(formatter.format(dateObj)).getData();
		final StringBuilder emails = new StringBuilder();
		userList.forEach(user -> {
			if (user.getEmail() != null && user.getEmail().trim().length() > 1) {
				emails.append(user.getEmail() + ",");
			}
		});
		if(emails.length() > 1){
			LOG.debug("Send Mails to: {}", emails);
			sendNotification(emails.toString());	
		}
		LOG.debug("Cron job ended: >>>>>>>>>>>{}", LocalDate.now());
	}

	public void sendNotification(final String emailList) {
		final JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
		javaMailSender.setJavaMailProperties(properties);
		final Session session = Session.getInstance(properties, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(mailConfig.getUserName(), mailConfig.getPassword());
			}
		});
		session.setDebug(true);
		javaMailSender.setSession(session);
		sendMail(emailList, javaMailSender, session);
	}

	private void sendMail(final String emailList, final JavaMailSenderImpl javaMailSender, final Session session) {
		final MimeMessage message = new MimeMessage(session);
		try {
			message.setFrom(new InternetAddress(mailConfig.getFrom()));
			final InternetAddress[] address = InternetAddress.parse(emailList);
			message.setRecipients(Message.RecipientType.TO, address);
			message.setSubject("StatusHub Reminder");
			final String content = getContent();
			message.setContent(content, "text/html");
			javaMailSender.send(message);
			LOG.debug("Mails send Successfully.");
		} catch (final MessagingException e) {
			LOG.error("Error while Sending Mail to: {}",e.getLocalizedMessage());
		}
	}

	private String getContent() {
		return "<html><body> Hi " + LocalDate.now()
				+ ",<br> You have not submitted your status for Today. "
				+ "Please submit it on <a href='172.18.0.6:8000' target='_blank'>Status Hub</a> before 5:00 pm."
				+ "<br><br> Regards,<br> <b>StatusHub Admin</b> </body></html>";
	}

	private Properties setMailProperties() {
		final Properties props = new Properties(); 
		props.put("mail.smtp.host", mailConfig.getHost());
		props.put("mail.smtp.port", mailConfig.getPort());
		if ("smtp.gmail.com".equalsIgnoreCase(mailConfig.getHost())) {
			props.put("mail.smtp.ssl.enable", mailConfig.isSmtpSSLEnable());
		}
		props.put("mail.smtp.auth", mailConfig.isSmtpAuth());
		props.put("mail.smtp.username", mailConfig.getUserName());
		props.put("mail.smtp.password", mailConfig.getPassword());
		props.put("mail.smtp.starttls.enable", mailConfig.isSmtpSSLEnable());
		return props;
	}



}
