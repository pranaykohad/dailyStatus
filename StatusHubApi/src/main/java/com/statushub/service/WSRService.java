package com.statushub.service;

import org.springframework.web.multipart.MultipartFile;

import com.statushub.entity.Result;

public interface WSRService {
	
	public Result getSheetNames(final MultipartFile file);
	public Result uploadLeaveReport(final MultipartFile file, final String sheetName, final int start, final int end);
}
