package com.statushub.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.statushub.entity.Result;
import com.statushub.service.WSRService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class WSRController {


	@Autowired
	WSRService wsrService;

	@PostMapping("/sheetNames")
	public Result getSheetNames(@RequestParam final MultipartFile file) {
		return wsrService.getSheetNames(file);
	}
	
	@PostMapping("/wsrReport")
	public Result cerateWSRReport(@RequestParam final MultipartFile file, @RequestParam final String sheetName) {
 		return wsrService.getWSRReport(file, sheetName);
	}


}
