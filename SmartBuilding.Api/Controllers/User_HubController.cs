using AuthServer.Constants;
using AuthServer.Data.Identity;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuilding.Api.helper;
using SmartBuilding.Api.Services.User_Hubs;
using SmartBuilding.Api.ViewModels;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.Controllers
{
    [Route("api/user_hub")]
    [ApiController]
    public class User_HubController : ControllerBase
    {
        public IAuthorizationService _authorizationService { get; }
        private readonly IUser_HubService _user_HubService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public User_HubController(IAuthorizationService authorizationService, IUser_HubService user_HubService, IMapper mapper, UserManager<AppUser> userManager)
        {
            _authorizationService = authorizationService;
            _user_HubService = user_HubService;
            _mapper = mapper;
            _userManager = userManager;
        }

        /// <summary>
        /// Danh sách device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>

        //[HttpGet]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[Route("{page}/{per_page}")]
        //public IActionResult Get(int page, int per_page)
        //{
        //    try
        //    {
        //    }
        //    catch
        //    {
        //    }
        //}
        [HttpGet]
        [Route("user")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetAllUser(string keyword, int pageSize, int page = 1)
        {
            //var authorizationResult = await _authorizationService
            //     .AuthorizeAsync(User, null, "Consumer");
            try
            {
                IEnumerable<AppUser> result_user = _userManager.Users.Where(x=>x.status==false).ToList();
                if (!string.IsNullOrEmpty(keyword))
                    result_user = result_user.Where(x => x.UserName.Contains(keyword));
                int totalRow = result_user.Count();

                var data = result_user
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);

                var paginationSet = new PagedResult<AppUser>()
                {
                    Results = data.ToList(),
                    CurrentPage = page,
                    RowCount = totalRow,
                    PageSize = pageSize,
                };
                return Ok(paginationSet);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.InnerException);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetAll(string keyword)
        {
            //var authorizationResult = await _authorizationService
            //     .AuthorizeAsync(User, null, "Consumer");
            try
            {
                IEnumerable<User_Hub> result_user_hub = _user_HubService.GetAll().OrderByDescending(x => x.updated_at);
                if (!string.IsNullOrEmpty(keyword))
                    result_user_hub = result_user_hub.Where(x => x.userid.ToString().Contains(keyword));
                return Ok(result_user_hub);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.InnerException);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        /// <summary>
        /// thêm mới device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>

        [HttpPost]
        [Route("user")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Create(UserViewModel _user)
        {
            //var Adminsdfsf = _userManager.Users.ToList();

            var Admin = _userManager.FindByNameAsync(_user.username).Result;

            if (Admin == null)
            {
                DateTime gettime = DateTime.Now;
                var user = new AppUser { 
                    UserName = _user.username, 
                    Name = _user.username, 
                    Email = _user.email,
                    note=_user.note,
                    status = false,
                    userid_by= _user.userid_by,
                    created_by=_user.created_by,
                    created_at = gettime,
                    updated_at = gettime,
                };

                var result = await _userManager.CreateAsync(user, _user.password);

                if (!result.Succeeded) return BadRequest(result.Errors);

                await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("userName", user.UserName));
                await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("name", user.Name));
                await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("email", user.Email));
                await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("role", Roles.Consumer));

                return Ok();
            }
            else
            {
                return NotFound("Thất bại");
            }
        }
        /// <summary>
        /// thêm mới device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult CreateUserHub(List<UserHubViewModel> user_hub)
        {
            try
            {

                DateTime gettime = DateTime.Now;
                foreach (UserHubViewModel _user_hub in user_hub)
                {
                    if (!string.IsNullOrEmpty(_user_hub.hub_code))
                    {
                        var data = new UserHubViewModel()
                        {
                            userid = _user_hub.userid,
                            username = _user_hub.username,
                            email = _user_hub.email,
                            password = _user_hub.password,
                            hubid = _user_hub.hubid,
                            hub_code = _user_hub.hub_code,
                            hub_password_client = _user_hub.hub_password_client,
                            note = _user_hub.note,
                            status = _user_hub.status,
                            userid_by = _user_hub.userid_by,
                            created_at = gettime,
                            created_by = _user_hub.created_by,
                            updated_at = gettime
                        };
                        var result_UserHubViewModel = _mapper.Map<User_Hub>(data);
                        _user_HubService.Add(result_UserHubViewModel);

                    }
                }
                return Ok();
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.InnerException);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException);
            }
        }

        /// <summary>
        /// Sửa device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Update(User_Hub user_hub)
        {
            var Admin = _userManager.FindByNameAsync(user_hub.username).Result;
            if (Admin != null)
            {
                try
                {
                    DateTime gettime = DateTime.Now;
                    user_hub.updated_at = gettime;
                    var result_user_hub = _user_HubService.Update(user_hub, user_hub.id);
                    if (result_user_hub == null)
                        return NotFound(new { Messager = "Thất Bại" });

                    return Ok(result_user_hub);
                }
                catch (ValidationException ex)
                {
                    return BadRequest(ex.InnerException);
                }
                catch (DbUpdateException ex)
                {
                    return BadRequest(ex.InnerException);
                }
            }
            return Ok();
        }

        /// <summary>
        /// Xóa device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("{id}")]
        public IActionResult Delete(Guid Id)
        {
            try
            {
                User_Hub result_user_hub = _user_HubService.Find(x => x.id == Id);
                _user_HubService.Delete(result_user_hub);
                return Ok();
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.InnerException);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException);
            }
        }
        /// <summary>
        /// Xóa device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("user/{id}")]
        public async Task<IActionResult> DeleteUser(string Id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(Id);
                var rolesForUser = await _userManager.GetRolesAsync(user);
                    if (rolesForUser.Count() > 0)
                    {
                        foreach (var item in rolesForUser.ToList())
                        {
                            // item should be the name of the role
                            var result = await _userManager.RemoveFromRoleAsync(user, item);
                        }
                    }
                    await _userManager.DeleteAsync(user);
                    return Ok();
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.InnerException);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.InnerException);
            }
        }
    }
}