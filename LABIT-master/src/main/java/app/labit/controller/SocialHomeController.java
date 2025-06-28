package app.labit.controller;

import app.labit.Exceptions.AlreadyData;
import app.labit.Exceptions.NothingWorkException;
import app.labit.dto.param.ParamDto;
import app.labit.dto.session.SessionUser;
import app.labit.service.member.MemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Controller
@CrossOrigin(origins = "*")
public class SocialHomeController {

    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Resource
    private MemberService memberService;

    @RequestMapping(value = "/")
    public String socialHome(HttpSession session){
        return "redirect:/index.mv";
    }

    @RequestMapping(value="/index.mv" )
    public String index(Model model, HttpSession session){


        model.addAttribute("loginYn", "N");
        return "soc:index";

    }

    @RequestMapping(value = "/login.mv")
    public String loginMove(Model model){
        System.out.println("run");
        return "log:login_form";
    }

    @RequestMapping(value = "/login.act")
    public Map<String, Object> loginUser(Model model, HttpSession session, @RequestBody ParamDto params){
        Map<String, Object> hashMap = new HashMap<>();

        SessionUser sessionUser = params.getForm(SessionUser.class);

        try {
            memberService.memberInsert(sessionUser);
        } catch (Exception e) {
            hashMap.put("result", "FAIL");
            hashMap.put("message", e.getMessage());
            return hashMap;
        }
        hashMap.put("result", "SUCCESS");

        return hashMap;
    }

    @RequestMapping(value = "/registMember.act")
    @ResponseBody
    @Transactional
    public Map<String, Object> registMember(Model model, HttpSession session, @RequestBody ParamDto params){

        Map<String, Object> hashMap = new HashMap<>();

        SessionUser sessionUser = params.getForm(SessionUser.class);
        try {
            memberService.memberInsert(sessionUser);
        } catch (AlreadyData | NoSuchAlgorithmException | NothingWorkException | NullPointerException e ) {
            hashMap.put("result", "FAIL");
            hashMap.put("message", e.getMessage());
            e.getStackTrace();
            System.out.println(e.getStackTrace());
            return hashMap;
        }

        hashMap.put("result", "SUCCESS");

        return hashMap;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/test")
    @ResponseBody
    public Map<String,Object> test(){
        Map<String, Object> map = new HashMap<>();
        map.put("result", "result");
        map.put("status", "status");
        return map;
    }

}
