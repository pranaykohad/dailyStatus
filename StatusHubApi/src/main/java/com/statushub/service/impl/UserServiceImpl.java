package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.constant.ReportConstant;
import com.statushub.entity.Holiday;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.User;
import com.statushub.repository.HolidayRepository;
import com.statushub.repository.LeaveRepository;
import com.statushub.repository.UserRepository;
import com.statushub.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private static final Logger LOG = LoggerFactory.getLogger("UserServiceImpl.class");

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private HolidayRepository holidayRepository;

	@Autowired
	private LeaveRepository leaveRepository;

	@Override
	public User autheticateUser(final String userName, final String password) {
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
		if (userType.equalsIgnoreCase("All")) {
			userTypes.addAll(ReportConstant.getAllUserTypeList());
		} else {
			userTypes.add(userType);
		}
		final List<User> userList = userRepo.findAllUsers(userTypes);
		bulidUserList(finalUserList, userList);
		return finalUserList;
	}

	@Override
	public Result getDefaultersList(final String date) {
		final Result result = new Result();
		List<User> finalUserList = new ArrayList<>();
		final List<String> userTypes = new ArrayList<>();
		userTypes.addAll(ReportConstant.getAllUserTypeList());
		final List<User> allUserList = userRepo.findAllUsers(userTypes);
		final List<User> validUserList = userRepo.getValidUserList(date);
		if (isHoliday(date)) {
			result.setDescription("It is a Holiday");
		} else {
			allUserList.removeAll(validUserList);
			bulidUserList(finalUserList, allUserList);
			finalUserList = removeOnLeaveUser(finalUserList, date);
			if (finalUserList.isEmpty()) {
				result.setDescription("No Defaulter Today");
			} else {
				result.setData(finalUserList);
			}
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
			LOG.debug("Error while deleting user {}", userId);
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
		List<User> finalUserList = userRepo.findAllUsers(userTypes);
		finalUserList.forEach(user -> user.setDefCount(0));
		dateList.forEach(date -> {
			if (!isHoliday(date)) {
				final List<User> allUserList = userRepo.findAllUsers(userTypes);
				final List<User> validUserList = userRepo.getValidUserList(date);
				allUserList.removeAll(validUserList);
				finalUserList.forEach(user -> {
					if (!isUserOnLeave(user.getUserId(), date)) {
						allUserList.forEach(defUser -> {
							if ((user.getUserId() == defUser.getUserId())) {
								user.setDefCount(user.getDefCount() + 1);
							}
						});
					}
				});
			}
		});
		final List<User> validUsers = getValidUsers(finalUserList);
		finalUserList.removeAll(validUsers);
		final List<User> sortedList = finalUserList.stream()
				.sorted(Comparator.comparingInt(User::getDefCount).reversed()).collect(Collectors.toList());
		result.setData(sortedList);
		return result;
	}

	@Override
	public User findByFirstnameAndLastname(final String firstName, final String lastName) {
		return userRepo.findByFirstnameAndLastname(firstName, lastName);
	}

	@Override
	public Result getUserById(final int userId) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final User user = userRepo.getUserByUserId(userId);
		if (user != null) {
			result.setData(user);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	@Override
	public Result findAllUsersButAmin() {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final List<User> userList = userRepo.findAllUsersButAmin();
		if (!userList.isEmpty()) {
			result.setData(userList);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	private List<User> getValidUsers(final List<User> userList) {
		final List<User> list = new ArrayList<>();
		userList.forEach(user -> {
			if (user.getDefCount() == 0) {
				list.add(user);
			}
		});
		return list;
	}

	private void bulidUserList(final List<User> finalUserList, final List<User> userList) {
		if (!userList.isEmpty()) {
			userList.forEach(user -> {
				final User tempUser = new User();
				tempUser.setFirstName(user.getFirstName());
				tempUser.setLastName(user.getLastName());
				tempUser.setUserId(user.getUserId());
				finalUserList.add(tempUser);
			});
		}
	}

	private boolean isHoliday(String date) {
		final String currentHyphenDate = getSlashToHyphenDate(date);
		final Holiday holiday = holidayRepository.findByStart(currentHyphenDate);
		return holiday != null;
	}

	private String getSlashToHyphenDate(String date) {
		final String[] tokens = date.split("/");
		return tokens[2] + "-" + tokens[0] + "-" + tokens[1];
	}

	private List<User> removeOnLeaveUser(final List<User> userList, final String date) {
		final List<User> finalUserList = new CopyOnWriteArrayList<>(userList);
		for (User user : finalUserList) {
			if (isUserOnLeave(user.getUserId(), date)) {
				finalUserList.remove(user);
			}
		}
		return finalUserList;
	}

	private boolean isUserOnLeave(final int userId, final String date) {
		final String finalDate = getSlashToHyphenDate(date);
		final int count = leaveRepository.getLeaveCountByDate(userId, finalDate);
		return count == 1;
	}
}
