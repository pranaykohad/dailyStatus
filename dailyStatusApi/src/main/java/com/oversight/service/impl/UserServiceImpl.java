package com.oversight.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oversight.entity.User;
import com.oversight.repository.UserRepository;
import com.oversight.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public User autheticateUser(final String  userName,final String password) {
		return userRepo.getUserByUserNameAndPassword(userName, password);
	}

	@Override
	public User updateUserDetails(final User user) {
		return userRepo.save(user);
	}

	@Override
	public User addUser(User user) {
		return userRepo.save(user);
	}

	@Override
	public List<User> getAllUser() {
		final List<User> finalUserList = new ArrayList<>();
		final List<User> userList = userRepo.findAll();
		if(!userList.isEmpty()) {
			userList.forEach(user-> {
				final User tempUser = new User();
				tempUser.setFirstName(user.getFirstName());
				tempUser.setLastName(user.getLastName());
				tempUser.setUserId(user.getUserId());
				finalUserList.add(tempUser);
			});
		}
		return finalUserList;
	}


}
