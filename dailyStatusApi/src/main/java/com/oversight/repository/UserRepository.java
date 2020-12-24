package com.oversight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.oversight.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	public User getUserByUserNameAndPassword(String userName, String password);
	
	@Query(value="SELECT * FROM Duser u where u.user_id = ?1", nativeQuery = true)
	public User getUserByUserId(String userId);
	
	@Query(value = "SELECT u.* FROM  duser u JOIN dstatus s ON u.user_id = s.user_user_id WHERE s.d_date = ?1", nativeQuery = true)
	public List<User> getValidUserList(String date);

}
