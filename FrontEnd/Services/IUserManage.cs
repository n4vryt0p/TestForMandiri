namespace FrontEnd.Services;

public interface IUserManage
{
    UserEngine Ready();
}
public class UserManage : IUserManage
{

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _iConfig;

    public UserManage(IHttpClientFactory httpClientFactory, IConfiguration iConfig)
    {
        _httpClientFactory = httpClientFactory;
        _iConfig = iConfig;
    }

    public UserEngine Ready()
    {
        var baseurl = _iConfig.GetSection("Configs")["BackEndApi"];
        var httpClient = _httpClientFactory.CreateClient("BaseClient");
        return new UserEngine(baseurl, httpClient);
    }
}