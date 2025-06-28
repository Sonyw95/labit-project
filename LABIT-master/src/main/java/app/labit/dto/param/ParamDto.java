package app.labit.dto.param;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.ibatis.type.Alias;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Alias("ParamDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data class ParamDto {

    private Map<String, Object> form;
    private List<Map<String, Object>> data;

    /**
     * use only one row parameter.
     * @return
     */
    public <T>  T getForm(Class<T> clz){
        T t = null;
        if(form == null){
            //log.error("form ::::  null");
            return t;
        }
        try {
            t = clz.getConstructor().newInstance();
            BeanUtils.populate(t, form);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.getStackTrace();
            e.printStackTrace();;
            throw new RuntimeException("객체 생성시 오류 임(getForm)");
        }
        return t;
    }

    public <T> List<T> getDataList(Class<T> clz) {
        List<T> list = new ArrayList<>();
        if(data == null){
            //log.error("paramDto.data ::::  null");
            return list;
        }
        try {
            for (Map<String, Object> paramsData : data) {
                T t = clz.getConstructor().newInstance();
                BeanUtils.populate(t, paramsData);
                list.add(t);
            }
        } catch (Exception e) {
            //log.error("e : " + e);
        }
        return list;
    }

}