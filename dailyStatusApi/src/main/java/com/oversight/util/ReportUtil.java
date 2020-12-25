package com.oversight.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.oversight.constant.ReportConstant;
import com.oversight.entity.Status;
import com.oversight.entity.User;
import com.oversight.repository.UserRepository;

@Component
public class ReportUtil {

	private static final Logger LOG = LoggerFactory.getLogger("ReportUtil.class");

	@Autowired
	UserRepository userRepository;

	private static final int DESC_LEN = 130;

	private static final int SMALL_A = 97;

	public void addGreeting(final StringBuilder content) {
		content.append(ReportConstant.getGreeting());
		content.append(ReportConstant.THREE_LINE);
	}
	
	public void addHeading(final StringBuilder content, final String reportType, final String startDate, final String endDate) {
		content.append(reportType+" Report from "+startDate+" to "+endDate+" :");
		content.append(ReportConstant.TWO_LINE);
	}
	
	

	public void addName(final StringBuilder content, final String userId) {
		final User user = userRepository.getUserByUserId(userId);
		LOG.debug("User is added: {}",user.getUserId());
		content.append("Name: "+user.getFirstName()+" "+user.getLastName());
		content.append(ReportConstant.TWO_LINE);
	}

	public void addModuleName(final StringBuilder content, final String module) {
		content.append(module+":");
		content.append(ReportConstant.TWO_LINE);
	}

	public void addStatus(final StringBuilder content, final List<Status> todayStsList) {
		for(int i=0; i<todayStsList.size(); i++) {
			final Status sts = todayStsList.get(i);
			content.append((char)(i+SMALL_A)+".     ");
			content.append(sts.getTicketId() + ": " + formatDescription(todayStsList, i) + " ");
			content.append("("+sts.getUser().getFirstName()+" "+sts.getUser().getLastName()+")");
			content.append(ReportConstant.ONE_LINE);
		}
	}

	public void addCustomStatus(final StringBuilder content, final List<Status> todayStsList) {
		for(int i = 0; i < todayStsList.size(); i++) {
			if((i > 0) && (!todayStsList.get(i).getdDate().equals(todayStsList.get(i-1).getdDate()))) {
				content.append("-------------------------------------------------------");
				content.append(ReportConstant.ONE_LINE);
			}
			content.append(i+1+".     ");
			content.append(todayStsList.get(i).getdDate()+" ");
			content.append(todayStsList.get(i).getTicketId()+" ");
			content.append(todayStsList.get(i).getDescription() + " ");
			content.append("- "+todayStsList.get(i).getState()+" ");
			content.append(ReportConstant.ONE_LINE);
		}
	}

	public void createSubHeading(final StringBuilder content, final String userType, final String state) {
		switch (userType.toUpperCase().trim()) {
			case "DEV":
				addSubHeading(content, "Developement", state);
				break;
			case "QA":
				addSubHeading(content, "Testing", state);
				break;
			case "PQA":
				addSubHeading(content, "Performance Testing", state);
				break;	
			case "AQA":
				addSubHeading(content, "Automation", state);
				break;	
			default:
				break;
		}
	}

	public List<String> getUserTypeList(final String module) {
		List<String> userTypes = new ArrayList<>();
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

	public void addSubHeading(final StringBuilder content, final String task, final String state) {
		content.append(task+" is "+state+" for:");
		content.append(ReportConstant.TWO_LINE);
	}

	public String formatDescription(final List<Status> todayStsList, final int i) {
		final StringBuilder finalString = new StringBuilder();
		String desc = todayStsList.get(i).getDescription() != null ? todayStsList.get(i).getDescription() : "";
		if(desc.length() >= 130) {
			final String[] tokens = desc.split("(?<=\\G.{" + DESC_LEN + "})");
			final List<String> subStrList = Arrays.asList(tokens);
			for(int j=0; j<subStrList.size(); j++) {
				finalString.append(subStrList.get(j));
				if(j < subStrList.size()-1) {
					finalString.append(ReportConstant.ONE_LINE);
					finalString.append("       ");
				}
			}
			desc = finalString.toString();
		}
		return desc;
	}

	public String formatDate(final String date) {
		final String[] tokens = date.split("/");
		String month = tokens[0];
		String day = tokens[1];
		final String year = tokens[2];
		month = month.length() == 1 ? "0"+month : month;
		day = day.length() == 1 ? "0"+day : day;
		return month+"/"+day+"/"+year;
	}

}
