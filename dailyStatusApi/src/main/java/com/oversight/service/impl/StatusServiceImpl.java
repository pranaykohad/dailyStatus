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
	
	private static final Logger LOG = LoggerFactory.getLogger("StatusServiceImpl.class");
	
	@Autowired
	private StatusRepository stsRepo;
	
	@Autowired
	ReportUtil reportUtil;
	
	@Override
	public List<Status> saveStatus(final List<Status> statusList) {
		List<Status> list = new ArrayList<>();
		if(statusList != null) {
			list = stsRepo.saveAll(statusList);
			LOG.debug("Status is saved for {}",statusList.get(0).getUser().getUserId());
		} else {
			LOG.debug("Cannot save {}",statusList);
		}
		return list;
	}
	
	@Override
	public Result createReport(final String date) {
		Result result = new Result();
		StringBuilder dailyStatusFileContent = createDailyReport(date);
		byte[] byteConent = dailyStatusFileContent.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename(LocalDate.now()+".txt");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		return result;
	}

	@Override
	public Result createReport(final String userId, final String startDate, final String endDate, final String reportType) {
		Result result = new Result();
		StringBuilder dailyStatusFileContent = createDailyReport(userId, startDate, endDate, reportType);
		byte[] byteConent = dailyStatusFileContent.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename(LocalDate.now()+".txt");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		return result;
	}
	
	private StringBuilder createDailyReport(final String date) {
		StringBuilder content = new StringBuilder();
		reportUtil.addGreeting(content);
		ReportConstant.getModuleList().forEach(module-> {
			reportUtil.addModuleName(content, module);
			List<String> userTypeList = reportUtil.getUserTypeList(module);
			createContent(date, content, module, userTypeList);
		});
		LOG.debug("Date {}", date);
		LOG.debug("Content {}", content);
		return content;
	}
	
	private StringBuilder createDailyReport(final String userId, final String startDate, final String endDate, final String  reportType) {
		StringBuilder content = new StringBuilder();
		reportUtil.addName(content, userId, reportType, startDate, endDate);
		final List<Status> statusList = stsRepo.getStatusByUserAndDateRange(userId, startDate, endDate);
		reportUtil.addCustomStatus(content, statusList);
		return content;
	}

	private void createContent(final String date, StringBuilder content, String module, List<String> userTypeList) {
		int subHeadCntr = 0;		
		for(int i = 0; i < userTypeList.size(); i++) {
			for(int stateIndx = 0; stateIndx < ReportConstant.getStateList().size(); stateIndx++) {	
				addStsToContent(date, content, module, userTypeList.get(i), stateIndx, ++subHeadCntr);
			}
			content.append(ReportConstant.ONE_LINE);
		}
	}
	
	private void addStsToContent(final String date, StringBuilder content, String module, String userType, int stateIndx, int subHeadCntr) {
		final String state = ReportConstant.getStateList().get(stateIndx);
		final List<Status> statusList = getStatusByDate(date, module, userType, state);
		if(statusList.isEmpty()) {
			subHeadCntr--;
		} else {
			content.append(subHeadCntr+"."+ReportConstant.TAB);
			reportUtil.createSubHeading(content, userType, state);
			reportUtil.addStatus(content, statusList);
			content.append(ReportConstant.ONE_LINE);
		}
	}

	private List<Status> getStatusByDate(String date, String module, String type, String state) {
		return stsRepo.getStatusByDateModuleTypeAndState(date, module, type, state);
	}	

}
