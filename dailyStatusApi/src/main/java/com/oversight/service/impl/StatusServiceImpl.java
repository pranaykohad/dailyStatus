package com.oversight.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oversight.constant.ReportConstant;
import com.oversight.entity.Attachment;
import com.oversight.entity.Result;
import com.oversight.entity.Status;
import com.oversight.repository.StatusRepository;
import com.oversight.service.StatusService;
import com.oversight.util.ReportUtil;

@Service
public class StatusServiceImpl implements StatusService {
	
	@Autowired
	private StatusRepository stsRepository;
	
	@Autowired
	ReportUtil reportUtil;
	
	private static final Logger LOG = LoggerFactory.getLogger("StatusServiceImpl.class");

	@Override
	public StringBuilder createDailyStatusReport(final String date) {
		StringBuilder content = new StringBuilder();
		content.append(ReportConstant.getGreeting());
		ReportConstant.getModuleList().forEach(module-> {
			reportUtil.addModuleName(content, module);
			List<String> userTypes = new ArrayList<>();
			userTypes = getUserTypeList(module, userTypes);
			
			
				userTypes.forEach(userType-> {			
					for(int i=0; i<ReportConstant.getStateList().size(); i++) {			
						addStatusToContent(date, content, module, userType, i);
					}
					content.append(ReportConstant.ONE_LINE);
				});	
				
				
				
		});
		LOG.debug("Date {}", date);
		LOG.debug("Content {}", content);
		return content;
	}

	private List<String> getUserTypeList(String module, List<String> userTypes) {
		switch (module) {
		case "OCR":
			userTypes = ReportConstant.getOcrUserTypeList();
			break;
		case "Connector":
			userTypes = ReportConstant.getConnUserTypeList();
			break;
		case "Workbench 9.2":
			userTypes = ReportConstant.getWbUserTypeList();
			break;
		case "Automation":
			userTypes = ReportConstant.getAutoUserTypeList();
			break;	
		default:
			break;
		}
		return userTypes;
	}
	
	@Override
	public Result createReport(final String date) {
		Result result = new Result();
		StringBuilder dailyStatusFileContent = createDailyStatusReport(date);
		byte[] byteConent = dailyStatusFileContent.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename(LocalDate.now()+".txt");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		return result;
	}

	@Override
	public List<Status> saveStatus(final List<Status> statusList) {
		return stsRepository.saveAll(statusList);
	}

	@Override
	public List<Status> getStatusByUserAndDateRange(String userId, String startDate, String endDate) {
		return stsRepository.getStatusByUserAndDateRange(userId, startDate, endDate);
	}

	@Override
	public List<Status> getStatusByDate(String date) {
		return stsRepository.getStateByDate(date);
	}

	@Override
	public List<Status> getStatus(String date, String module, String type, String state) {
		return stsRepository.getStatus(date, module, type, state);
	}
	
	private void addStatusToContent(final String date, StringBuilder content, String module, String userType, int i) {
		final List<Status> statusList = getStatus(date, module, userType, ReportConstant.getStateList().get(i));
		if(!statusList.isEmpty()) {
			content.append(i+1+"."+ReportConstant.TAB);
			final String state = ReportConstant.getStateList().get(i);
			reportUtil.createSubHeading(content, userType, state);
			reportUtil.addStatus(content, statusList);
			content.append(ReportConstant.ONE_LINE);
		}
	}

}
