package com.oversight.entity;

public class Result {
	
	public enum ResStatus {
		SUCCESS,
		FAILURE
	}
	
	private ResStatus status = ResStatus.SUCCESS;
	private String descrition;
	private Object data;
	
	public ResStatus getStatus() {
		return status;
	}
	public void setStatus(ResStatus status) {
		this.status = status;
	}
	public String getDescrition() {
		return descrition;
	}
	public void setDescrition(String descrition) {
		this.descrition = descrition;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
}
