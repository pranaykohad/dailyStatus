package com.statushub.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.statushub.repository.SettingRepository;

@Configuration
public class MailConfig {

	@Value("${spring.mail.host}")
	private String host;

	@Value("${spring.mail.port}")
	private int port;

	@Value("${spring.mail.properties.mail.smtp.auth}")
	private boolean smtpAuth;

	@Value("${spring.mail.properties.mail.smtp.ssl.enable}")
	private boolean smtpSSLEnable;

	private String adminMail;

	private String userName;

	private String password;

	MailConfig(final SettingRepository settingRepository) {
		this.adminMail = settingRepository.findByKeyName("ADMIN_MAIL").getValue();
		this.userName = settingRepository.findByKeyName("USER_NAME").getValue();
		this.password = settingRepository.findByKeyName("PASSWORD").getValue();
	}

	public String getAdminMail() {
		return adminMail;
	}

	public String getHost() {
		return host;
	}

	public int getPort() {
		return port;
	}

	public boolean isSmtpAuth() {
		return smtpAuth;
	}

	public boolean isSmtpSSLEnable() {
		return smtpSSLEnable;
	}

	public String getUserName() {
		return userName;
	}

	public String getPassword() {
		return password;
	}

}
