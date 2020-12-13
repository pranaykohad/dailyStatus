package com.oversight.serviceInt;

import com.oversight.entity.User;


public interface UserService {
	
	public User autheticateUser(final String userName,final String password);
	public User updateUserDetails(final User user);

}
