using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuilding.Api.helper;
using SmartBuilding.Api.Services.Devives;
using SmartBuilding.Api.ViewModels;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.Controllers
{
    [Authorize(Policy = "ApiReader")]
    [Route("api/device")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        public IAuthorizationService _authorizationService { get; }
        private readonly IDeviceService _deviceService;
        private readonly IMapper _mapper;

        public DeviceController(IAuthorizationService authorizationService, IDeviceService deviceService, IMapper mapper)
        {
            _authorizationService = authorizationService;
            _deviceService = deviceService;
            _mapper = mapper;
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> GetAll(string keyword, int pageSize, int page = 1)
        {
            var authorizationResult = await _authorizationService
                 .AuthorizeAsync(User, null, "Consumer");
            if (authorizationResult.Succeeded)
            {
                Console.WriteLine("ok");
            }
            else
            {
                Console.WriteLine("ng");
            }
            try
            {
                IEnumerable<Device> result_device = _deviceService.GetAll().OrderByDescending(x => x.updated_at);
                var result_DeviceViewModel = _mapper.Map<IEnumerable<DeviceViewModel>>(result_device);
                if (!string.IsNullOrEmpty(keyword))
                    result_DeviceViewModel = result_DeviceViewModel.Where(x => x.hubid.ToString().Contains(keyword));


                int totalRow = result_DeviceViewModel.Count();

                var data = result_DeviceViewModel
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);

                var paginationSet = new PagedResult<DeviceViewModel>()
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
        [Route("smarthub")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public IActionResult GetDeviceByHub(string keyword)
        {
            try
            {
                IEnumerable<Device> result_device = _deviceService.GetAll().OrderByDescending(x => x.updated_at);
                var result_DeviceViewModel = _mapper.Map<IEnumerable<DeviceViewModel>>(result_device);
                if (!string.IsNullOrEmpty(keyword))
                    result_DeviceViewModel = result_DeviceViewModel.Where(x => x.hubid.ToString()==keyword);

                return Ok(result_DeviceViewModel);
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Create(Device device)
        {
            try
            {
                DateTime gettime = DateTime.Now;
                device.created_at = gettime;
                device.updated_at = gettime;
                _deviceService.Add(device);
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
        public IActionResult Update(Device device)
        {
            try
            {
                DateTime gettime = DateTime.Now;
                device.updated_at = gettime;
                var result_device = _deviceService.Update(device, device.id);
                if (result_device == null)
                {
                    return NotFound(new { Messager = "Thất Bại" });
                }
                return Ok(result_device);
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
        [Route("{id}")]
        public IActionResult Delete(Guid Id)
        {
            try
            {
                Device result_device = _deviceService.Find(x => x.id == Id);
                _deviceService.Delete(result_device);
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