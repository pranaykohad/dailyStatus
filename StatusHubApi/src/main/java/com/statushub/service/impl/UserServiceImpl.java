package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.constant.ReportConstant;
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
	public User addUser(final User user) {
		return userRepo.save(user);
	}

	@Override
	public List<User> getUsersByUserType(final String userType) {
		final List<User> finalUserList = new ArrayList<>();
		final List<String> userTypes = new ArrayList<>();
		if(userType.equalsIgnoreCase("All")) {
			userTypes.addAll(ReportConstant.getAllUserTypeList());
		} else {
			userTypes.add(userType);
		}
		final List<User> userList = userRepo.getUserAllButAdmin(userTypes);
		bulidUserList(finalUserList, userList);
		return finalUserList;
	}

	@Override
	public Result getDefaultersList(final String date) {
		final Result result = new Result();
		final List<User> finalUserList = new ArrayList<>();
		final List<String> userTypes = new ArrayList<>();
		userTypes.addAll(ReportConstant.getAllUserTypeList());
		final List<User> allUserList = userRepo.getUserAllButAdmin(userTypes);
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
	public Result deleteUser(final String userId) {
		final Result result = new Result();
		try {
			userRepo.deleteById(Integer.parseInt(userId));
			result.setDescription("User is deleted successfully");
		} catch (final Exception e) {
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
	public Result getCustomDefaulters(final List<String> dateList) {
		final Result result = new Result();
		final List<String> userTypes = new ArrayList<>();
		userTypes.addAll(ReportConstant.getAllUserTypeList());
		final List<User> userList = userRepo.getUserAllButAdmin(userTypes);
		userList.forEach(user -> user.setDefCount(0));
		dateList.forEach(date -> {
			final List<User> defList =  userRepo.getUserAllButAdmin(userTypes);
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
		final List<User> sortedList = userList.stream().sorted(
			Comparator.comparingInt(User::getDefCount)
			.reversed()).collect(Collectors.toList());
		result.setData(sortedList);
		return result;
	}

	private List<User> getZeroCountList(final List<User> userList) {
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

	@Override
	public User findByFirstnameAndLastname(final String firstName, final String lastName) {
		return userRepo.findByFirstnameAndLastname(firstName, lastName);
	}

	@Override
	public Result getUserById(final int userId) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final User user =  userRepo.getUserByUserId(userId);
		if(user != null) {
			result.setData(user);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

}
