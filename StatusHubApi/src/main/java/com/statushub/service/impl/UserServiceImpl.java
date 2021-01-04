package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.User;
import com.statushub.repository.UserRepository;
import com.statushub.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	private static final Logger LOG = LoggerFactory.getLogger("UserServiceImpl.class");
	
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
		final List<User> userList = userRepo.getUserAllButAdmin();
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

	@Override
	public Result getDefaultersList(final String date) {
		final Result result = new Result();
		final List<User> allUserList = userRepo.getUserAllButAdmin();
		final  List<User> validUserList = userRepo.getValidUserList(date);
		allUserList.removeAll(validUserList);
		if (allUserList.isEmpty()) {
			result.setDescription("No Defaulters for Today");
		} else {
			result.setData(allUserList);
		}
		return result;
	}

	@Override
	public Result deleteUser(String userId) {
		final Result result = new Result();
		try {
			userRepo.deleteById(Integer.parseInt(userId));
			result.setDescription("User is deleted successfully");
		} catch (Exception e) {
			LOG.debug("Error while deleting user {}",userId);
			result.setStatus(ResStatus.FAILURE);
			result.setDescription("Failed to delete user");
		}
		return result;
	}

	@Override
	public Long userCount() {
		return userRepo.count();
	}	
	
}
