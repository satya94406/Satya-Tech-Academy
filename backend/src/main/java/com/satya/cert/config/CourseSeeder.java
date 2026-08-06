package com.satya.cert.config;

import com.satya.cert.entity.Course;
import com.satya.cert.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CourseSeeder {

    @Bean
    public CommandLineRunner initCourses(CourseRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    new Course("React Complete Course", 5.0, "10 Weeks"),
                    new Course("JavaScript Deep Dive", 3999.0, "8 Weeks"),
                    new Course("Full Stack Web Development", 9999.0, "20 Weeks"),
                    new Course("REST API Development", 2999.0, "4 Weeks"),
                    new Course("Java with Spring Boot", 6999.0, "12 Weeks"),
                    new Course("Git and GitHub", 1.0, "2 Weeks"),
                    new Course("Python for Data Science", 7999.0, "14 Weeks"),
                    new Course("DSA & System Design", 8999.0, "16 Weeks"),
                    new Course("DevOps & Cloud Fundamentals", 7999.0, "12 Weeks")
                ));
            }
        };
    }
}
