package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.User;
import com.statushub.repository.WSRRepository;
import com.statushub.service.LeaveService;
import com.statushub.service.UserService;
import com.statushub.service.WSRService;

@Service
public class WSRServiceImpl implements WSRService {
	
	private static final Logger LOG = LoggerFactory.getLogger("WSRServiceImpl.class");
	
	private static final int FIRST_NAME_ROW = 6;
	
	private static final int FIRST_DATE_CELL = 2;
	
	@Autowired
	private WSRRepository wsrRepo;

	@Autowired
	private LeaveService leaveService;
	
	@Autowired
	private UserService userService;

	@Override
	public Result getSheetNames(MultipartFile file) {
		leaveService.truncateLeaveTable();
		Result result = new Result();
		Workbook workbook = null;
		String extension  = FilenameUtils.getExtension(file.getOriginalFilename());
		try {
            if(extension.equalsIgnoreCase("xlsx")) {
            	workbook = new XSSFWorkbook(file.getInputStream());
            	final int sheetCount = workbook.getNumberOfSheets();
            	final List<String> sheetNames = new ArrayList<>();
            	for(int i = 0 ; i < sheetCount ; i++) {
            		sheetNames.add(workbook.getSheetName(i));
            	}
            	if(sheetNames.isEmpty()) {
            		result.setStatus(ResStatus.FAILURE);
            		result.setDescription("No sheet found");
            	} else {
            		result.setData(sheetNames);
            		result.setStatus(ResStatus.SUCCESS);
            	}
            } else {
            	result.setDescription("Invalid file type");
            	result.setStatus(ResStatus.FAILURE);
            }
		} catch (Exception e) {
			LOG.error(e.getLocalizedMessage());
			result.setDescription("Some error while extracting data, please try again");
		}
		return result;
	}

	@Override
	public Result uploadLeaveReport(MultipartFile file, String sheetName, int start, int end) {
		Result result = new Result();
		 Workbook workbook = null;
		 String extension  = FilenameUtils.getExtension(file.getOriginalFilename());
			try {
	            if(extension.equalsIgnoreCase("xlsx")) {
	            	workbook = new XSSFWorkbook(file.getInputStream());
	            	Sheet sheet = workbook.getSheet(sheetName);
	            	final int numOfRows = sheet.getPhysicalNumberOfRows();
	            	final List<Leave> leaveList = new ArrayList<>();
	            	for(int i = FIRST_NAME_ROW ; i < numOfRows - 1 ; i++) {
	            		
	            		final Row row = sheet.getRow(i);
	            		final int cellCount = row.getPhysicalNumberOfCells();
	            		final String fullName = row.getCell(1).getStringCellValue();
	            		final String[] tokens = fullName.split(" ");
	            		final User user = getUserByFirstAndLastName(tokens);
	            		
	            		if(user != null) {
	            			scanRow(start, end, result, leaveList, i, row, cellCount, user);
	            		} else {
	            			LOG.debug("User not found : {} {}", tokens[0], tokens[1]);
	            			result.setDescription("User not found : "+tokens[0]+" "+tokens[1]);
	            			result.setStatus(ResStatus.FAILURE);
	            		}
	            	}
	            } else {
	            	result.setDescription("Invalid file type");
	            	result.setStatus(ResStatus.FAILURE);
	            }
	            
			} catch (Exception e) {
				LOG.error(e.getLocalizedMessage());
				result.setDescription("Some error while extracting data, please try again");
			}
		return result;
	}

	private User getUserByFirstAndLastName(final String[] tokens) {
		return userService.findByFirstnameAndLastname(tokens[0].trim().toUpperCase(), tokens[1].trim().toUpperCase());
	}

	private void scanRow(int start, int end, Result result, final List<Leave> leaveList, int i, final Row row,
			final int cellCount, final User user) {
		
		for(int j = FIRST_DATE_CELL ; j < cellCount ; j++) {
			final int todayDate = j - 1;
			
			if(!row.getCell(j).getStringCellValue().isEmpty() && start <= todayDate && todayDate <= end) {
				LOG.debug("CELL: ({}, {}); user found: {}; USER-ID {}; DATE: {}; TYPE: {}", i, j, user.getFirstName(), user.getUserId(), todayDate, row.getCell(j).getStringCellValue());
				Leave leave = new Leave();
				leave.setDate(j-1);
				leave.setType(row.getCell(j).getStringCellValue());
				leave.setUser(user);
				leaveList.add(leave);
			}
		}
		
		if(!leaveList.isEmpty()) {
			leaveService.addLeaves(leaveList);
			result.setStatus(ResStatus.SUCCESS);
			result.setDescription("All Records are added successfully");
			result.setData(null);
		} else {
			LOG.debug("No User to add");
			result.setDescription("No User to add");
			result.setStatus(ResStatus.FAILURE);
		}
	}

}
