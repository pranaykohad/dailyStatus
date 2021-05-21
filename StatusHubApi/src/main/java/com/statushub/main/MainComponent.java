package com.statushub.main;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.statushub.entity.Setting;
import com.statushub.entity.User;
import com.statushub.service.SettingService;
import com.statushub.service.UserService;


@EnableScheduling
@SpringBootApplication(scanBasePackages = "com")
@EntityScan("com.statushub.entity")
@EnableJpaRepositories("com.statushub.repository")
public class MainComponent {

	@Autowired
	UserService userService;

	@Autowired
	SettingService settingService;
	
	private static final Logger LOG = LoggerFactory.getLogger("MainComponent.class");


	public static void main(final String[] args) {
		SpringApplication.run(MainComponent.class, args);
		LOG.debug("StatusHub has started..........");
	}

	@PostConstruct
	public void init() {
		if (userService.userCount() == 0) {
			addDefaultUser();
			addDefaultSettings();
		}
	}

	private void addDefaultUser() {
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

	private void addDefaultSettings() {
		final List<Setting> settingList = new ArrayList<>();
		Setting setting = new Setting();

		setting.setKeyName("PLANNED_LEAVE_DIFFRENCE");
		setting.setValue("7");
		settingList.add(setting);

		setting = new Setting();
		setting.setKeyName("START_HOUR");
		setting.setValue("8");
		settingList.add(setting);

		setting = new Setting();
		setting.setKeyName("END_HOUR");
		setting.setValue("17");
		settingList.add(setting);

		setting = new Setting();
		setting.setKeyName("MODULE_LIST");
		setting.setValue("OCR,Connector,Workbench 9.2,Portal,Automation");
		settingList.add(setting);

		setting = new Setting();
		setting.setKeyName("USER_TYPE_LIST");
		setting.setValue("DEV,QA,AQA,PQA");
		settingList.add(setting);

		setting = new Setting();
		setting.setKeyName("POSITION_LIST");
		setting.setValue(
				"PgM,Project Lead,Sr. Architech,Sr. Tech Lead,Lead Developer,Developer,Sr. Developer,Perf. Eng.,Lead QA,QA,Sr. AQA,AQA");
		settingList.add(setting);

		settingService.saveOrUpdateSetting(settingList);
	}

}
