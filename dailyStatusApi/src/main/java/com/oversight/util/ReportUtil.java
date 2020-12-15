package com.oversight.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import com.oversight.constant.ReportConstant;
import com.oversight.entity.Status;

@Component
public class ReportUtil {
		
	private static final int DESC_LEN = 130;
	
	private static final int SMALL_A = 97;
	
	public void addGreeting(StringBuilder content) {
		content.append(ReportConstant.getGreeting());
		content.append(ReportConstant.THREE_LINE);
	}
	
	public void addModuleName(StringBuilder content, String module) {
		content.append(module+":");
		content.append(ReportConstant.TWO_LINE);
	}
	
	public void addStatus(StringBuilder content, List<Status> todayStsList) {
		for(int i=0; i<todayStsList.size(); i++) {
			content.append((char)(i+SMALL_A)+".     ");
			content.append(todayStsList.get(i).getTicketId()+": "+formatDescription(todayStsList, i)+" ");
			content.append("("+todayStsList.get(i).getUser().getFirstName()+")");
			content.append(ReportConstant.ONE_LINE);
		}
	}
	
	public void createSubHeading(StringBuilder content, String userType, final String state) {
		switch (userType) {
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
	
	public List<String> getUserTypeList(String module) {
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
	
	public void addSubHeading(StringBuilder content, String task, String state) {
		content.append(task+" is "+state+" for:");
		content.append(ReportConstant.TWO_LINE);
	}
	
	
	public String formatDescription(List<Status> todayStsList, int i) {
		final StringBuilder finalString = new StringBuilder();
		String desc = todayStsList.get(i).getDescription();
		if(desc.length() >= 130) {
			String[] tokens = desc.split("(?<=\\G.{" + DESC_LEN + "})");
			List<String> subStrList = Arrays.asList(tokens);
			for(int j=0; j<subStrList.size(); j++) {
				finalString.append(subStrList.get(j));
				if(j < subStrList.size()-1) {
					finalString.append(ReportConstant.ONE_LINE);
					finalString.append("      ");
				}
			}
			desc = finalString.toString();
		}
		return desc;
	}

}
