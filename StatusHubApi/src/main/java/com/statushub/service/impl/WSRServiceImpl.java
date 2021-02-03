package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.repository.WSRRepository;
import com.statushub.service.WSRService;

@Service
public class WSRServiceImpl implements WSRService {
	
	private static final Logger LOG = LoggerFactory.getLogger("WSRServiceImpl.class");
	
	@Autowired
	private WSRRepository wsrRepo;

	@Override
	public Result getSheetNames(MultipartFile file) {
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
            		result.setDescription("No sheet found");;
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
	public Result getWSRReport(MultipartFile file, String sheetName) {
		uploadLeaveReport(file, sheetName);
		return null;
	}
	
	private Result uploadLeaveReport(MultipartFile file, String sheetName) {
		Result result = new Result();
		 Workbook workbook = null;
		 String extension  = FilenameUtils.getExtension(file.getOriginalFilename());
			try {
	            if(extension.equalsIgnoreCase("xlsx")) {
	            	workbook = new XSSFWorkbook(file.getInputStream());
	            	Sheet sheet = workbook.getSheet(sheetName);
	            	Iterator<Row> itr =  sheet.iterator();
	            	extractLeaveData(itr);
	            } else {
	            	result.setDescription("Invalid file type");
	            }
	            
			} catch (Exception e) {
				LOG.error(e.getLocalizedMessage());
				result.setDescription("Some error while extracting data, please try again");
			}
		return result;
	}

	private void extractLeaveData(Iterator<Row> itr) {
		itr.next();
		itr.next();
		itr.next();
		itr.next();
		while(itr.hasNext()) {
			Row row = itr.next();
			if(row != null && row.getCell(1) != null) {
				final Row r = row;
				if(CellType.STRING.equals(r.getCell(1).getCellType())) {
					System.out.println("emp name : "+r.getCell(1).getStringCellValue());
					if(r.getCell(2) != null) {
						System.out.println("1 : "+row.getCell(2).getStringCellValue());
					}
					
				}
			}
		}
	}

}
