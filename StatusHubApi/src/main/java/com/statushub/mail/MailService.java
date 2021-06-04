package com.statushub.mail;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.statushub.entity.Setting;
import com.statushub.entity.User;
import com.statushub.repository.SettingRepository;
import com.statushub.service.UserService;

@Service
public class MailService {

	private static final Logger LOG = LoggerFactory.getLogger("MailServiceImpl.class");

	@Autowired
	private MailUtil mailUtil;

	@Autowired
	private UserService userService;

	@Autowired
	private SettingRepository settingRepository;

	@Bean
	public String getCronJobForDefReminder() {
		final Setting setting = settingRepository.findByKeyName("DEFAULTER_REMINDER_CRON_JOB");
		return setting.getValue();
	}

	@Scheduled(cron = "#{@getCronJobForDefReminder}")
	public void defaulterReminderCronJob() {
		LOG.debug("Defaulter reminder cron job starts: >>>>>>>>>>> {} ", mailUtil.getDateTime());
		final LocalDate dateObj = LocalDate.now();
		final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/YYYY");
		@SuppressWarnings("unchecked")
		final List<User> userList = (List<User>) userService.getDefaultersList(formatter.format(dateObj)).getData();
		final StringBuilder emailString = mailUtil.getMailsAsString(userList);
		if (emailString.length() > 1) {
			LOG.debug("Send Mails to: {}", emailString);
			final String content = mailUtil.defReminderContent();
			createMailSession(emailString.toString(), content);
		}
		LOG.debug("Defaulter reminder cron job ends: >>>>>>>>>>> {}", mailUtil.getDateTime());
	}

	private void createMailSession(final String emailList, final String content) {
		final JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
		javaMailSender.setJavaMailProperties(mailUtil.getProperties());
		final Session session = Session.getInstance(mailUtil.getProperties(), new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(mailUtil.getMailConfig().getUserName(),
						mailUtil.getMailConfig().getPassword());
			}
		});
		LOG.debug("Mail session created.");
		session.setDebug(true);
		javaMailSender.setSession(session);
		sendMail(emailList, content, javaMailSender, session);
	}

	private void sendMail(final String emailList, final String content, final JavaMailSenderImpl javaMailSender,
			final Session session) {
		final MimeMessage message = new MimeMessage(session);
		LOG.debug("Mail sending process starts.");
		try {
			final InternetAddress[] address = InternetAddress.parse(emailList);
			message.setFrom(new InternetAddress(mailUtil.getMailConfig().getAdminMail()));
			message.setRecipients(Message.RecipientType.TO, address);
			message.setSubject("StatusHub Reminder");
			message.setContent(content, "text/html");
			javaMailSender.send(message);
			LOG.debug("Mails are send Successfully.");
		} catch (final MessagingException e) {
			LOG.error("Error while Sending Mail to: {}", e.getLocalizedMessage());
		}
	}

}
