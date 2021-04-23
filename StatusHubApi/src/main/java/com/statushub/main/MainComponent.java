package com.statushub.main;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.statushub.entity.User;
import com.statushub.service.UserService;

@SpringBootApplication(scanBasePackages="com")
@EntityScan("com.statushub.entity")
@EnableJpaRepositories("com.statushub.repository")
public class MainComponent {

	@Autowired
	UserService userService;

	private static final Logger LOG = LoggerFactory.getLogger("controller.class");

	public static void main(final String[] args) {
		SpringApplication.run(MainComponent.class, args);
		LOG.debug("StatusHub has started..........");
	}

	@PostConstruct
	public void init(){
		if(userService.userCount() == 0) {
			final User adminUser = new User(); 
			adminUser.setFirstName("admin");
			adminUser.setLastName("admin");
			adminUser.setModuleName("Not Applicable");
			adminUser.setPosition("Not Applicable");
			adminUser.setUserName("admin");
			adminUser.setPassword("admin");
			adminUser.setRole("ADMIN");
			adminUser.setType("");
			adminUser.setBaseHours(0f);
			adminUser.setBillable(false);
			adminUser.setDefCount(0);
			adminUser.setEmail("");
			adminUser.setPosition("");
			userService.addUser(adminUser);
		}
	}

}
