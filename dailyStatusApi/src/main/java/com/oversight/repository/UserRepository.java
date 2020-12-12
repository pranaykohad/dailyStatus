package com.oversight.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oversight.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	public User getUserByUserId(final int userId);
	public User getUserByUserNameAndPassword(final String userName,final String password);

}
