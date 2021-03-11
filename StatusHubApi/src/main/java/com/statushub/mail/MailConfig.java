package com.statushub.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailConfig {

	@Value("${spring.mail.host}")
	private String host;

	@Value("${spring.mail.port}")
	private int port;

	@Value("statushub1000@gmail.com")
	private String from;

	@Value("statushub1000")
	private String userName;

	@Value("Statushub0000!")
	private String password;

	@Value("${spring.mail.properties.mail.smtp.auth}")
	private boolean smtpAuth;

	@Value("${spring.mail.properties.mail.smtp.ssl.enable}")
	private boolean smtpSSLEnable;

	public String getFrom() {
		return from;
	}

	public void setFrom(final String from) {
		this.from = from;
	}
	public boolean isSmtpAuth() {
		return smtpAuth;
	}
	public void setSmtpAuth(final boolean smtpAuth) {
		this.smtpAuth = smtpAuth;
	}
	public boolean isSmtpSSLEnable() {
		return smtpSSLEnable;
	}
	public void setSmtpSSLEnable(final boolean smtpSSLEnable) {
		this.smtpSSLEnable = smtpSSLEnable;
	}
	public String getHost() {
		return host;
	}
	public void setHost(final String host) {
		this.host = host;
	}
	public int getPort() {
		return port;
	}
	public void setPort(final int port) {
		this.port = port;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(final String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(final String password) {
		this.password = password;
	}



}
