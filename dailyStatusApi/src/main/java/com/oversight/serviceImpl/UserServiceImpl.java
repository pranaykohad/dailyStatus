package com.oversight.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oversight.entity.User;
import com.oversight.repository.UserRepository;
import com.oversight.serviceInt.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public User autheticateUser(final String  userName,final String password) {
		User user = userRepo.getUserByUserNameAndPassword(userName, password);
		return user;
	}

	@Override
	public User updateUserDetails(final User user) {
		return userRepo.save(user);
	}

	@Override
	public User getUserByUserId(final int userId) {
		return userRepo.getUserByUserId(userId);
	}

}
