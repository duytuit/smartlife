using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuilding.Api.helper;
using SmartBuilding.Api.Services.Hubs;
using SmartBuilding.Data.Entities;

namespace SmartBuilding.Api.Controllers
{
    [Route("api/hub")]
    [ApiController]
    public class HubController : ControllerBase
    {
        private readonly IHubService _hubService;
        private readonly IMapper _mapper;

        public HubController(IHubService hubService, IMapper mapper)
        {
            _hubService = hubService;
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
        public IActionResult GetAll(string keyword, int pageSize, int page=1)
        {
            try
            {
                IEnumerable<Hub> result_hub = _hubService.GetAll().OrderByDescending(x => x.updated_at);
                if (!string.IsNullOrEmpty(keyword))
                    result_hub = result_hub.Where(x => x.code_hub.Contains(keyword));


                int totalRow = result_hub.Count();

                var data = result_hub
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);

                var paginationSet = new PagedResult<Hub>()
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

        /// <summary>
        /// thêm mới device
        /// </summary>
        /// <param name="device">Object params</param>
        /// <response code="200">Successful Operation</response>
        /// <response code="404">Validation Exception</response>

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Create(Hub hub)
        {
            RandomGenerator generator = new RandomGenerator();
            string pass = generator.RandomPassword();
            try
            {
                DateTime gettime = DateTime.Now;
                hub.password_client = pass;
                hub.clientid = hub.code_hub;
                hub.created_at = gettime;
                hub.updated_at = gettime;
                _hubService.Add(hub);
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
        public IActionResult Update(Hub hub)
        {
            try
            {
                DateTime gettime = DateTime.Now;
                hub.clientid = hub.code_hub;
                hub.updated_at = gettime;
                var result_hub = _hubService.Update(hub, hub.id);
                if (result_hub == null)
                {
                    return NotFound(new { Messager = "Thất Bại" });
                }
                return Ok(result_hub);
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
                Hub result_hub = _hubService.Find(x => x.id == Id);
                _hubService.Delete(result_hub);
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