package app.labit.dao;

public interface DatabaseDao {
    public Object execSelect(String nameSpace, String id, Object obj);
    public Object execSelectList(String nameSpace, String id, Object obj);
    public int execInsert(String nameSpace, String id , Object obj);
    public int execUpdate(String nameSpace, String id, Object obj);
    public int execDelete(String nameSpace, String id, Object obj);
}
