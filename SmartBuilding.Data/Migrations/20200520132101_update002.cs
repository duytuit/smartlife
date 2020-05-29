using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartBuilding.Data.Migrations
{
    public partial class update002 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "User_Hubs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "email",
                table: "User_Hubs");
        }
    }
}
