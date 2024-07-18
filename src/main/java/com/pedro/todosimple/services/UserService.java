package com.pedro.todosimple.services;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pedro.todosimple.models.User;
import com.pedro.todosimple.models.enums.ProfileEnum;
import com.pedro.todosimple.repositories.UserRepository;
import com.pedro.todosimple.services.exceptions.DataBindingViolationException;
import com.pedro.todosimple.services.exceptions.ObjectNotFoundException;

@Service
public class UserService {
    
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    public User findById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        // Utilizamos o Optional pra que caso ele não encontro o usuário no banco ele retorne vazio e não null

        return user.orElseThrow(() -> new ObjectNotFoundException(
            "Usuário não encontrado! Id: " + id + ", Tipo: " + User.class.getName()
        )); 
        // Só vai retornar se o user estiver preenchido, caso contrátrio ele irá realizar um throw exception
    }

    @Transactional
    public User create(User obj) {
        obj.setId(null);
        obj.setPassword(this.bCryptPasswordEncoder.encode(obj.getPassword()));
        obj.setProfiles(Stream.of(ProfileEnum.USER.getCode()).collect(Collectors.toSet()));
        obj = this.userRepository.save(obj);
        return obj;
    }

    @Transactional
    public User update(User obj) {
        User newObj = findById(obj.getId());
        newObj.setPassword(obj.getPassword());
        newObj.setPassword(this.bCryptPasswordEncoder.encode(obj.getPassword()));
        return this.userRepository.save(newObj);
    }

    public void delete(Long id) {
        findById(id); // é o próprio findById do UserService
        try {
            this.userRepository.deleteById(id);
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possivel excluir pois há entidades relacionadas!");
        }
    }

    
}
