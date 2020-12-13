package com.oversight.service;

import com.oversight.entity.UserDTO;


public interface UserService {
	
	public UserDTO autheticateUser(final String userName,final String password);
	public UserDTO updateUserDetails(final UserDTO user);

}
