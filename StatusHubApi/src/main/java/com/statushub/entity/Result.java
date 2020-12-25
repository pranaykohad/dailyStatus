package com.statushub.entity;

public class Result {
	
	public enum ResStatus {
		SUCCESS,
		FAILURE
	}
	
	private ResStatus status = ResStatus.SUCCESS;
	private String description;
	private Object data;
	
	public ResStatus getStatus() {
		return status;
	}
	public void setStatus(ResStatus status) {
		this.status = status;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
}
