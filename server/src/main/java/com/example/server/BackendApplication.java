package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private DataSource dataSource;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		try (Connection conn = dataSource.getConnection()) {
			System.out.println("CONNECTION SUCCESSFUL");
			System.out.println("Catalog: " + conn.getCatalog());
			System.out.println("Schema: " + conn.getSchema());
		}
	}
}
//@SpringBootApplication
//public class BackendApplication {
//
//	public static void main(String[] args) {
////		SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
//		SpringApplication.run(BackendApplication.class, args);
//	}
//
//}
