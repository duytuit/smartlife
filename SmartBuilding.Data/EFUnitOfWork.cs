using Microsoft.EntityFrameworkCore.Storage;
using SmartBuilding.Data.EF;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data
{
    public class EFUnitOfWork : IUnitOfWork
    {
        private readonly SmartBuildingDbContext _smartBuildingDbContext;
        private IDbContextTransaction _transaction;

        public EFUnitOfWork(SmartBuildingDbContext smartBuildingDbContext)
        {
            _smartBuildingDbContext = smartBuildingDbContext;
        }

        public void BeginTransaction()
        {
            _transaction = _smartBuildingDbContext.Database.BeginTransaction();
        }

        public void Commit()
        {
            _smartBuildingDbContext.SaveChanges();
        }

        public void Dispose()
        {
            _smartBuildingDbContext.Dispose();
        }

        public void Rollback()
        {
            _transaction.Rollback();
            _transaction.Dispose();
        }

        public void TransactionCommit()
        {
            _transaction.Commit();
        }
    }
}
