package com.oversight.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oversight.entity.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Integer>{
	
	public UserDTO getUserByUserNameAndPassword(final String userName,final String password);

}
