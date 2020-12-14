package com.oversight.util;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import com.oversight.entity.Status;

@Component
public class ReportUtil {
	
	private static final String ONE_LINE = "\r\n";
	
	private static final String TWO_LINE = "\r\n\r\n";
	
	private static final String TAB = "     ";
	
	private static final int DESC_LEN = 130;
	
	public void addModuleName(StringBuilder content, String module) {
		if(module.equalsIgnoreCase("OCR")) {
			content.append(TWO_LINE+ONE_LINE);
		}
		content.append(module+":");
		content.append(TWO_LINE);
	}
	
	public void addStatus(StringBuilder content, List<Status> todayStsList) {
		for(int i=0; i<todayStsList.size(); i++) {
			content.append((char)(i+97)+".     ");
			content.append(todayStsList.get(i).getTicketId()+": "+formatDescription(todayStsList, i)+" ");
			content.append("("+todayStsList.get(i).getUser().getFirstName()+")");
			content.append(ONE_LINE);
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
		default:
			break;
		}
	}
	
	public void addSubHeading(StringBuilder content, String task, String state) {
		content.append(task+" is "+state+" for:");
		content.append(TWO_LINE);
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
					finalString.append(ONE_LINE);
					finalString.append(TAB+" ");
				}
			}
			desc = finalString.toString();
		}
		return desc;
	}

}
