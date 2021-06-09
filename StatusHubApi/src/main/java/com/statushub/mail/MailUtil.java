package com.statushub.mail;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.statushub.entity.Setting;
import com.statushub.entity.User;
import com.statushub.repository.SettingRepository;

@Component
public class MailUtil {

	private Properties properties;

	private MailConfig mailConfig;

	@Autowired
	SettingRepository settingRepository;

	MailUtil(final MailConfig mailConfig) {
		this.mailConfig = mailConfig;
		this.properties = setMailProperties();
	}

	public String defReminderContent() {
		final Setting setting = settingRepository.findByKeyName("END_TIME");
		final int endHour = Integer.parseInt(setting.getValue().split(":")[0]);
		return "<html><body>Dear Sir/Madam,<br>You have not submitted your status for Today. "
		+ "Please submit it on <a href='http://172.18.0.6:8000' target='_blank'>StatusHub</a> before " + (endHour - 12) + " " + setMeridiem(endHour)
		+ ".<br><br>Regards,<br><b>StatusHub Admin</b><br>"
		+ "(This is an auto generated mail, please do not reply)" + "</body></html>";
	}

	public Properties getProperties() {
		return properties;
	}

	public MailConfig getMailConfig() {
		return mailConfig;
	}

	public StringBuilder getMailsAsString(final List<User> userList) {
		final StringBuilder emails = new StringBuilder();
		userList.forEach(user -> {
			if (user.getEmail() != null && user.getEmail().trim().length() > 1) {
				emails.append(user.getEmail() + ",");
			}
		});
		return emails;
	}

	public String getDateTime() {
		final LocalDateTime dateTime = LocalDateTime.now();
		final DateTimeFormatter formattedDateTime = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		return dateTime.format(formattedDateTime);
	}

	private String setMeridiem(final int endHour) {
		return endHour < 12 ? "am" : "pm";
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
