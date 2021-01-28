package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
		bulidUserList(finalUserList, userList);
		return finalUserList;
	}

	@Override
	public Result getDefaultersList(final String date) {
		final Result result = new Result();
		final List<User> finalUserList = new ArrayList<>();
		final List<User> allUserList = userRepo.getUserAllButAdmin();
		final  List<User> validUserList = userRepo.getValidUserList(date);
		allUserList.removeAll(validUserList);
		bulidUserList(finalUserList, allUserList);
		if (finalUserList.isEmpty()) {
			result.setDescription("No Defaulter Today");
		} else {
			result.setData(finalUserList);
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

	@Override
	public Result getCustomDefaulters(List<String> dateList) {
		final Result result = new Result();
		final List<User> userList = userRepo.getUserAllButAdmin();
		userList.forEach(user -> user.setDefCount(0));
		dateList.forEach(date -> {
			List<User> defList =  userRepo.getUserAllButAdmin();
			final  List<User> validUserList = userRepo.getValidUserList(date);
			defList.removeAll(validUserList);
			userList.forEach(user -> {
				defList.forEach(defUser -> {
					if(user.getUserId() == defUser.getUserId()) {
						user.setDefCount(user.getDefCount()+1);
					}
				});
			});
		});
		final List<User> zeroCntList = getZeroCountList(userList);
		userList.removeAll(zeroCntList);
		List<User> sortedList = userList.stream().sorted(
									Comparator.comparingInt(User::getDefCount)
											  .reversed()).collect(Collectors.toList());
		result.setData(sortedList);
		return result;
	}

	private List<User> getZeroCountList(List<User> userList) {
		final List<User> zeroCntList = new ArrayList<>();
		userList.forEach(user -> {
			if(user.getDefCount() == 0) {
				zeroCntList.add(user);
			}
		});
		return zeroCntList;
	}

	private void bulidUserList(final List<User> finalUserList, final List<User> userList) {
		if(!userList.isEmpty()) {
			userList.forEach(user-> {
				final User tempUser = new User();
				tempUser.setFirstName(user.getFirstName());
				tempUser.setLastName(user.getLastName());
				tempUser.setUserId(user.getUserId());
				finalUserList.add(tempUser);
			});
		}
	}

}
