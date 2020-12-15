package com.oversight.service;

import java.util.List;

import com.oversight.entity.User;



public interface UserService {
	
	public User autheticateUser(final String userName,final String password);
	public User updateUserDetails(final User user);
	public User addUser(final User user);
	public List<User> getAllUser();

}
