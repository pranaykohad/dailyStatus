package com.oversight.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oversight.entity.UserDTO;
import com.oversight.repository.UserRepository;
import com.oversight.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDTO autheticateUser(final String  userName,final String password) {
		return userRepo.getUserByUserNameAndPassword(userName, password);
	}

	@Override
	public UserDTO updateUserDetails(final UserDTO user) {
		return userRepo.save(user);
	}


}
