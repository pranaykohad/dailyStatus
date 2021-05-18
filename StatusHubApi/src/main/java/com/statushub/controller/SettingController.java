package com.statushub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.statushub.entity.Result;
import com.statushub.service.SettingService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class SettingController {

	@Autowired
	SettingService settingService;

	@GetMapping("/setting")
	public Result getAllSettings() {
		return settingService.getAllSettings();
	}

	@GetMapping("/setting/{key}")
	public Result getSettings(@PathVariable
		final String key) {
		return settingService.getSetting(key);
	}

}
