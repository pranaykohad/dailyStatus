package com.oversight.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages="com")
@EntityScan("com.oversight.entity")
@EnableJpaRepositories("com.oversight.repository")
public class mainComponent {
	
	private static final Logger LOG = LoggerFactory.getLogger("controller.class");

	public static void main(String[] args) {
		SpringApplication.run(mainComponent.class, args);
		LOG.debug("app started...........");
	}

}
