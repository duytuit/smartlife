using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartBuilding.Data.Migrations
{
    public partial class update001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hubs",
                columns: table => new
                {
                    id = table.Column<Guid>(nullable: false),
                    code_hub = table.Column<string>(nullable: true),
                    clientid = table.Column<string>(nullable: true),
                    password_client = table.Column<string>(nullable: true),
                    roomid = table.Column<Guid>(nullable: false),
                    room_name = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    status = table.Column<bool>(nullable: false),
                    userid_by = table.Column<Guid>(nullable: false),
                    created_by = table.Column<string>(nullable: true),
                    created_at = table.Column<DateTime>(nullable: false),
                    updated_at = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hubs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Devices",
                columns: table => new
                {
                    id = table.Column<Guid>(nullable: false),
                    name_device = table.Column<string>(nullable: true),
                    code_device = table.Column<string>(nullable: true),
                    device_type = table.Column<string>(nullable: true),
                    number_switch = table.Column<string>(nullable: true),
                    hubid = table.Column<Guid>(nullable: false),
                    hub_code = table.Column<string>(nullable: true),
                    hub_password_client = table.Column<string>(nullable: true),
                    hub_room_name = table.Column<string>(nullable: true),
                    icon = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    status = table.Column<bool>(nullable: false),
                    userid_by = table.Column<Guid>(nullable: false),
                    created_by = table.Column<string>(nullable: true),
                    created_at = table.Column<DateTime>(nullable: false),
                    updated_at = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devices", x => x.id);
                    table.ForeignKey(
                        name: "FK_Devices_Hubs_hubid",
                        column: x => x.hubid,
                        principalTable: "Hubs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User_Hubs",
                columns: table => new
                {
                    id = table.Column<Guid>(nullable: false),
                    userid = table.Column<Guid>(nullable: false),
                    username = table.Column<string>(nullable: true),
                    hubid = table.Column<Guid>(nullable: true),
                    hub_code = table.Column<string>(nullable: true),
                    hub_password_client = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    status = table.Column<bool>(nullable: false),
                    userid_by = table.Column<Guid>(nullable: false),
                    created_by = table.Column<string>(nullable: true),
                    created_at = table.Column<DateTime>(nullable: false),
                    updated_at = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Hubs", x => x.id);
                    table.ForeignKey(
                        name: "FK_User_Hubs_Hubs_hubid",
                        column: x => x.hubid,
                        principalTable: "Hubs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Devices_hubid",
                table: "Devices",
                column: "hubid");

            migrationBuilder.CreateIndex(
                name: "IX_User_Hubs_hubid",
                table: "User_Hubs",
                column: "hubid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Devices");

            migrationBuilder.DropTable(
                name: "User_Hubs");

            migrationBuilder.DropTable(
                name: "Hubs");
        }
    }
}
