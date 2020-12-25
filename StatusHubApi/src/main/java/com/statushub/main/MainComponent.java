package com.statushub.main;

import java.net.InetAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages="com")
@EntityScan("com.statushub.entity")
@EnableJpaRepositories("com.statushub.repository")
public class MainComponent {
	
	private static Environment environment;
	
	public MainComponent(final Environment environment) {
		this.environment = environment;
	}
	
	private static final Logger LOG = LoggerFactory.getLogger("controller.class");

	public static void main(String[] args) {
		SpringApplication.run(MainComponent.class, args);
		String ip = InetAddress.getLoopbackAddress().getHostAddress();
		LOG.debug("StatusHub has started..........http://{}:{}",ip,environment.getProperty("server.port"));
	}

}
