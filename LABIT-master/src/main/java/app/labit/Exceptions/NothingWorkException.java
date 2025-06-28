package app.labit.Exceptions;

public class NothingWorkException extends Exception{

    public NothingWorkException(){
        super("적용된 데이터가 없습니다.");
    }
}
