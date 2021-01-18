package com.statushub.constant;

import java.util.Arrays;
import java.util.List;

public class ReportConstant {
	
	private ReportConstant() {}
		
	public static final String ONE_LINE = "\r\n";
	
	public static final String TWO_LINE = "\r\n\r\n";
	
	public static final String THREE_LINE = "\r\n\r\n\r\n";
	
	public static final String TAB = "     ";
	
	private static final String GREETING= "Hello,"+ONE_LINE+ONE_LINE+"Please find below today’s update:";
	
	private static final List<String> MODULE_LIST = Arrays.asList("OCR", "Connector", "Workbench 9.2", "Portal", "Automation");
	
	private static final List<String> OCR_USER_TYPE_LIST = Arrays.asList("DEV", "QA");
	
	private static final List<String> CONN_USER_TYPE_LIST = Arrays.asList("DEV", "QA");
	
	private static final List<String> WB_USER_TYPE_LIST = Arrays.asList("DEV", "QA", "PQA");
	
	private static final List<String> PORT_TYPE_LIST = Arrays.asList("DEV", "QA");
	
	private static final List<String> AUTO_USER_TYPE_LIST = Arrays.asList("AQA");
	
	private static final List<String> STATE_LIST = Arrays.asList("In progress", "Completed");

	public static String getGreeting() {
		return GREETING;
	}

	public static List<String> getModuleList() {
		return MODULE_LIST;
	}

	public static List<String> getOcrUserTypeList() {
		return OCR_USER_TYPE_LIST;
	}

	public static List<String> getConnUserTypeList() {
		return CONN_USER_TYPE_LIST;
	}

	public static List<String> getWbUserTypeList() {
		return WB_USER_TYPE_LIST;
	}
	
	public static List<String> getPortTypeList() {
		return PORT_TYPE_LIST;
	}

	public static List<String> getAutoUserTypeList() {
		return AUTO_USER_TYPE_LIST;
	}

	public static List<String> getStateList() {
		return STATE_LIST;
	}
	
}
