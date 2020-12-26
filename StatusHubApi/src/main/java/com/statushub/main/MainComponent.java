package com.statushub.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages="com")
@EntityScan("com.statushub.entity")
@EnableJpaRepositories("com.statushub.repository")
public class MainComponent {
	
	private static final Logger LOG = LoggerFactory.getLogger("controller.class");

	public static void main(String[] args) {
		SpringApplication.run(MainComponent.class, args);
		LOG.debug("StatusHub has started..........");
	}

}
