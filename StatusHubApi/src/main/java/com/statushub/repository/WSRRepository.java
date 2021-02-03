package com.statushub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.statushub.entity.User;
import com.statushub.entity.WSREntity;

@Repository
public interface WSRRepository extends JpaRepository<WSREntity, Integer>{
	

}
