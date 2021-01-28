package com.statushub.service;

import java.util.List;

import com.statushub.entity.Result;
import com.statushub.entity.User;



public interface UserService {
	
	public User autheticateUser(final String userName,final String password);
	public User updateUserDetails(final User user);
	public User addUser(final User user);
	public List<User> getAllUser();
	public Result getDefaultersList(final String date);
	public Result getCustomDefaulters(final List<String> dateList);
	public Result deleteUser(final String userId);
	public Long userCount();
}
